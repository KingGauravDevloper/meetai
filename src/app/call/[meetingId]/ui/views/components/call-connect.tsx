"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { CallUI } from "./call-ui";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  
  // FIX THE TYPO: useMutation NOT uselWutation
  const { mutateAsync: generateVideoToken } = trpc.meetings.generateVideoToken.useMutation();

  const [client, setClient] = useState<StreamVideoClient>();
  
  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Create token provider function
        const tokenProvider = async () => {
          console.log("Generating video token...");
          const token = await generateVideoToken();
          console.log("Token generated successfully");
          return token;
        };

        const _client = new StreamVideoClient({
          apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
          user: {
            id: userId,
            name: userName,
            image: userImage,
          },
          tokenProvider,
        });

        setClient(_client);
      } catch (error) {
        console.error("Failed to initialize Stream client:", error);
      }
    };

    initializeClient();

    return () => {
      if (client) {
        client.disconnectUser();
        setClient(undefined);
      }
    };
  }, [userId, userName, userImage, generateVideoToken]);

  const [call, setCall] = useState<Call>();
  
  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();
    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="w-6 h-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};