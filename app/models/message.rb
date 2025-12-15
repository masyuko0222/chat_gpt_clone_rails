class Message < ApplicationRecord
  belongs_to :chat
  enum :role, { user: 0, assistant: 1 }

  validates :role, presence: true
  validates :content, presence: true
end
