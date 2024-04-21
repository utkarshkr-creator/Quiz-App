import { useEffect, useState } from "react"
const intialState = "";
const optionIntialState = [{
  id: 0,
  title: ""
}, {
  id: 1,
  title: ""
}, {
  id: 2,
  title: ""
}, {
  id: 3,
  title: ""
}];
export const CreateProblem = ({ socket, roomId }: { socket: any; roomId: string; }) => {
  const [title, setTitle] = useState(intialState);
  const [description, setDescription] = useState(intialState);
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState(optionIntialState)
  const [reset, setReset] = useState<boolean>(false);
  useEffect(() => {
    setTitle(intialState);
    setDescription(intialState);
    setOptions(optionIntialState);
    setAnswer(0);
  }, [reset])
  return <div>
    Create problem
    Title = <input type="text" onChange={(e) => {
      setTitle(e.target.value)
    }}></input>
    <br /><br />
    Description - <input type="text" onChange={(e) => {
      setDescription(e.target.value)
    }}></input>
    <br />

    {[0, 1, 2, 3].map(optionId => <div>
      <input type="radio" checked={optionId === answer} onChange={() => {
        setAnswer(optionId)
      }}></input>
      Option {optionId}
      <input type="text" onChange={(e) => {
        setOptions(options => options.map(x => {
          if (x.id === optionId) {
            return {
              ...x,
              title: e.target.value
            }
          }
          return x;
        }))
      }}></input>
      <br />
    </div>)}

    <button onClick={() => {
      socket.emit("createProblem", {
        roomId,
        problem: {
          title,
          description,
          options,
          answer,
        }
      });
      setReset(!reset);
    }}>Add problem</button>

  </div>
}
