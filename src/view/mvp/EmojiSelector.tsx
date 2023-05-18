import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function EmojiSelector() {
  return (
    <Picker data={data} onEmojiSelect={console.log} />
  )
}