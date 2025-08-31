import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { createAgent, gemini, TextMessage } from "@inngest/agent-kit";
import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";

const summarizer = createAgent({
   name: "summarizer",
   system: `
   
   `.trim(),
   model: gemini({ model: "gemini-2.0-flash-lite", apiKey: process.env.GEMINI_API_KEY })
   });

export const helloWorld = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [...new Set(transcript.map((item) => item.speaker_id))];

      // Fetch users matching speakerIds
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds));

      // Fetch agents matching speakerIds
      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds));

      // Combine users and agents into a single speakers array
      const speakers = [
        ...userSpeakers.map((u) => ({ ...u, type: "user" })),
        ...agentSpeakers.map((a) => ({ ...a, type: "agent" })),
      ];

      // Map transcript items to include speaker info
      return transcript.map((item) => {
        const speaker = speakers.find((s) => s.id === item.speaker_id);

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name ?? "Unknown",
            type: speaker.type,
            // you can add other speaker properties here as needed
          },
        };
      });
    });

    return transcriptWithSpeakers;

    const { output } = await summarizer.run(
      "Summarize the following transcript: " + 
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
       await db 
         .update(meetings)
         .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
         })
         .where(eq(meetings.id, event.data.meetingId))
    })
  }
);
