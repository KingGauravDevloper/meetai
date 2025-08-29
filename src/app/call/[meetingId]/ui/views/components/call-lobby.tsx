import Link from "next/link";
import {
  DefaultVideoPlaceholder as StreamDefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
  OwnCapability,
} from "@stream-io/video-react-sdk";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
}

const DefaultVideoPlaceholder = () => {
  const { data } = authClient.useSession();

  return (
    <StreamDefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatarUri({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
};

const AllowBrowserPermissions = () => {
  return (
    <p className="text-sm">
      Please grant your browser permission to access your camera and microphone.
    </p>
  );
};

export const CallLobby = ({ onJoin }: Props) => {
  const { useHasPermissions } = useCallStateHooks();

  // Check mic and camera permissions
  const hasMicPermission = useHasPermissions(OwnCapability.SEND_AUDIO);
  const hasCameraPermission = useHasPermissions(OwnCapability.SEND_VIDEO);

  const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>

          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission ? undefined : AllowBrowserPermissions
            }
          />

          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          <div className="flex gap-x-2 justify-between w-full">
            <Button asChild variant="ghost">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin}>Join</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
