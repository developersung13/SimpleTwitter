import { ref, uploadString } from "@firebase/storage";
import STwitter from "components/STwitter";
import { dbService, storageService } from "fbase";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

function Home({ userObj }) {
  const [stwitter, setSTwitter] = useState("");
  const [stwitters, setSTwitters] = useState([]);
  const [attachment, setAttachment] = useState();
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
    const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);
    const response = await uploadString(fileRef, attachment, "data_url");
    console.log(response);
    // await dbService.collection("simple-twitter").add({
    //   text: stwitter,
    //   createdAt: Date.now(),
    //   creatorID: userObj.uid,
    // });
    // setSTwitter("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setSTwitter(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachmentClick = () => setAttachment(null);
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        {attachment && (
          <>
            <img src={attachment} width="100px" height="100px" />
            <button onClick={onClearAttachmentClick}>Clear</button>
          </>
        )}
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
