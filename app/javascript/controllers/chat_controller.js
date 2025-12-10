import { Controller } from "@hotwired/stimulus"
import { marked } from "marked";
import DOMPurify from "dompurify";

// Connects to data-controller="chat"
export default class extends Controller {
  static targets = ["prompt", "conversation", "scroll", "greeting"]
  connect() {
  }

  generateResponse(event) {
    event.preventDefault();

    if (this.hasGreetingTarget) {
      this.greetingTarget.remove();
    }

    this.#appendMessage("user", this.promptTarget.value);

    this.assistantMessage = this.#appendMessage("assistant", "");

    this.#streamAssistantResponse();

    this.promptTarget.value = "";
  }

  #appendMessage(role, content="") {
    const template = document.getElementById("chat-message");
    const clone = template.content.cloneNode(true);
    clone.firstElementChild.setAttribute("data-role", role)
    const message = clone.querySelector(".message");
    message.innerHTML = content;
    this.conversationTarget.appendChild(clone);

    return message;
  }

  async #streamAssistantResponse() {
    const prompt = this.promptTarget.value;
    const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    const response = await this.#requestStream(prompt, csrfToken);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    this.rawContent = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;
      if (!value) continue;

      this.#addAssistantMessage(value, decoder);
    }
  }

  async #requestStream(prompt, csrfToken) {
    const response = await fetch("/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({ prompt })  
    });

    return response;
  }

  #addAssistantMessage(chunk, decoder) {
    const lines = decoder.decode(chunk).split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const raw = line.slice(6).trim();

        try {
          const { message } = JSON.parse(raw);
          this.rawContent += message;
          this.assistantMessage.innerHTML = DOMPurify.sanitize(marked.parse(this.rawContent));
          this.scrollTarget.scrollIntoView({ behavior: "smooth", block: "end" });
        } catch (error) {
          console.log("Raw data", raw);
        }
      }
    }
  }
}
