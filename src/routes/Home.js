import STwitter from "components/STwitter";
import { dbService } from "fbase";
import { useEffect, useState } from "react";
function Home({ userObj }) {
  const [stwitter, setSTwitter] = useState("");
  const [stwitters, setSTwitters] = useState([]);
  useEffect(() => {
    dbService
      .collection("simple-twitter")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const stwitterArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSTwitters(stwitterArray);
      });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("simple-twitter").add({
      text: stwitter,
      createdAt: Date.now(),
      creatorID: userObj.uid,
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
        {/* Profile Image */}
        <img
          src={userObj.photoURL}
          alt=""
          width={150}
          style={{ borderRadius: "50%" }}
        />
        {stwitters.map((sTwitter) => (
          <STwitter
            key={sTwitter.id}
            sTwitterObj={sTwitter}
            isOwner={sTwitter.creatorID === userObj.uid}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
