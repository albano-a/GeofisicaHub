import { useState } from "react";

export default function Footer() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div className="w-full pt-10 pb-6 border-t">
        <div className="max-w-7xl mx-auto px-4">
          Um rodapé, olha que legal
          <button onClick={() => setCount(count + 1)}>Incrementar</button>
        </div>
      </div>
    </>
  );
}
