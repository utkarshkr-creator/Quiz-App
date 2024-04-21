
export const QuizControls = ({ socket, roomId }: { socket: any, roomId: string }) => {
  return <div className="bg-red-400 cursor-pointer" >
    <button type="button" onClick={() => {
      socket.emit("next", {
        roomId
      })
    }}>Next problem</button>
  </div>
}
