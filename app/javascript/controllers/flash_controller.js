import { Controller } from "@hotwired/stimulus"
import toastr from "toastr"

// Connects to data-controller="flash"
export default class extends Controller {
  connect() {
    const flashType = this.element.dataset.flashType
    const flashMessage = this.element.dataset.flashMessage

    if (flashType == "notice") {
      toastr.success(flashMessage, "Success")
    }

    if (flashType == "alert") {
      toastr.error(flashMessage, "Error")
    }
  }
}
