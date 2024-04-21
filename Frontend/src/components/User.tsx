import { useState } from "react";
import { UserLoggedin } from "./UserLoggedin";


export const User = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [submited, setSubmitted] = useState(false);

  if (!submited) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-slate-800">
                Quizer
              </h1>
              <h2 className="text-2xl font-semibold mb-2 text-slate-600">
                Enter the code to join
              </h2>
            </div>

            <div className="mb-8">
              <input
                className="w-80 p-4 rounded-xl bg-[#F4F4F6] text-left text-black outline-offset-2 outline-4 focus:outline outline-[#E8E9FF] focus:border focus:border-purple-500 hover:border "
                placeholder="1234 or 5678"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <br />
              <input
                className="w-80 mt-4 p-4 rounded-xl bg-[#F4F4F6] text-left text-black outline-offset-2 outline-4 focus:outline outline-[#E8E9FF] focus:border focus:border-purple-500 hover:border "
                placeholder="Your name"
                style={{ fontSize: "1rem" }}
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <button
              className="bg-[#2C2C2D] text-white w-64 px-8 py-4 rounded-full shadow-md hover:bg-[#2c2c2df1] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              style={{ fontSize: "1rem" }}
              onClick={() => {
                setSubmitted(true);
              }}
            >
              Join quiz
            </button>
          </div>
        </div>
      </div>
    )
  }
  return <UserLoggedin code={code} name={name} />
}
