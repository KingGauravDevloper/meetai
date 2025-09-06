import { StreamTheme, useCall, CallingState } from "@stream-io/video-react-sdk"
import { useState, useCallback, useEffect } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
    meetingName: string;
};

export const CallUI = ({ meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
    const [isJoining, setIsJoining] = useState(false);

    // Check current call state on mount
    useEffect(() => {
        if (call?.state.callingState === CallingState.JOINED) {
            setShow("call");
        }
    }, [call]);

    const handleJoin = useCallback(async () => {
        if (!call || isJoining || call.state.callingState === CallingState.JOINED) return;

        setIsJoining(true);
        try {
            await call.join();
            setShow("call");
        } catch (error) {
            console.error("Failed to join call:", error);
        } finally {
            setIsJoining(false);
        }
    }, [call, isJoining]);

    const handleLeave = useCallback(() => {
        if (!call) return;

        call.endCall();
        setShow("ended");
    }, [call]);

    return (
        <StreamTheme className="h-full">
            {show === "lobby" && <CallLobby onJoin={handleJoin} isJoining={isJoining} />}
            {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    );
};