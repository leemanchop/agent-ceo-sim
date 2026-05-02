import type { EventCategory, FeedSource } from "@/lib/types";

export function categoryVariant(c: EventCategory):
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "purple"
  | "gray" {
  switch (c) {
    case "FUNDRAISING":
      return "green";
    case "REGULATORY":
      return "amber";
    case "PRESS":
      return "blue";
    case "FBI":
      return "red";
    case "FOUNDER":
      return "purple";
    case "BANKING":
      return "amber";
    case "CRYPTO_AI":
      return "purple";
    case "PRODUCT":
    case "HIRING":
    case "CUSTOMERS":
    case "OPERATIONS":
    default:
      return "gray";
  }
}

export function sourceColor(s: FeedSource): string {
  switch (s) {
    case "twitter":
      return "#1d9bf0";
    case "bloomberg":
      return "#f59e0b";
    case "techcrunch":
      return "#0a8a00";
    case "forbes":
      return "#f5b900";
    case "slack":
      return "#4a154b";
    case "glassdoor":
      return "#0caa41";
    case "fbi":
      return "#ff5a47";
    case "discord":
      return "#5865f2";
    default:
      return "#7a7363";
  }
}

export function sourceLabel(s: FeedSource): string {
  switch (s) {
    case "twitter":
      return "X";
    case "bloomberg":
      return "Bloomberg";
    case "techcrunch":
      return "TechCrunch";
    case "forbes":
      return "Forbes";
    case "slack":
      return "Slack";
    case "glassdoor":
      return "Glassdoor";
    case "fbi":
      return "FBI";
    case "discord":
      return "Discord";
    default:
      return "—";
  }
}
