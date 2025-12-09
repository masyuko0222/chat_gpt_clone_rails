import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="chat"
export default class extends Controller {
  static targets = ["prompt", "conversation"]
  connect() {
  }

  generateResponse(event) {
    event.preventDefault();

    // add user's message element
    const userMessage = document.createElement("div");
    userMessage.textContent = this.promptTarget.value;
    this.conversationTarget.appendChild(userMessage);
    console.log(userMessage);

    // add assistant's response element
    const assistantMessage = document.createElement("div");
    this.assistantMessage = assistantMessage;
    this.conversationTarget.appendChild(assistantMessage);

    this.assistantMessage.innerHTML = "こんにちは。アシスタントAIです。";

    this.promptTarget.value = "";
  }
}
