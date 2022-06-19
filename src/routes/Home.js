import { dbService } from "fbase";
import { useEffect, useState } from "react";
function Home() {
  const [stwitter, setSTwitter] = useState("");
  const [stwitters, setSTiwtters] = useState([]);
  const getstwitter = async () => {
    const dbsTwitter = await dbService.collection("simple-twitter").get();
    dbsTwitter.forEach((document) => {
      const stwitterObject = {
        ...document.data(),
        id: document.id,
      };
      setSTiwtters((prev) => [stwitterObject, ...prev]);
    });
  };
  useEffect(() => {
    getstwitter();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("simple-twitter").add({
      stwitter,
      createdAt: Date.now(),
    });
    setSTwitter("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSTwitter(value);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          value={stwitter}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="sTwitter" />
      </form>
      <div>
        {stwitters.map((sTwitter) => (
          <div key={sTwitter.id}>
            <h4>{sTwitter.stwitter}</h4>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
