import React from "react";
import GitHubIcon from "./icons/GitHubIcon";
import DiscordIcon from "./icons/DiscordIcon";

export default function Footer() {
  return (
    <div className=" flex items-center justify-end p-2 w-screen text-[var(--text-footer)]">
      {/* Div para centrar "Enjoy chatting with AI" */}
      <div className="absolute left-1/2 transform -translate-x-1/2 ">
        Enjoy chatting with AI
      </div>

      {/* Div para los íconos y el texto "Create by MikeDevQh" alineados a la derecha */}
      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/MikeDevQH/CHAT-AI-APP"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <GitHubIcon />
        </a>
        <a
          href="https://discord.com/users/925933412710232105"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform duration-200"
        >
          <DiscordIcon />
        </a>
        <span>Create by MikeDevQh</span>
      </div>
    </div>
  );
}
