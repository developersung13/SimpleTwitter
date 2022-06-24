import { dbService, storageService } from "fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState } from "react";
import { v4 } from "uuid";

function STwitterFactory({ userObj }) {
  const [stwitter, setSTwitter] = useState("");
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    if (stwitter === "") {
      alert("입력된 내용이 없습니다.");
      return;
    } else {
      let attachmentUrl = "";
      if (attachment !== "") {
        const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
        await uploadString(attachmentRef, attachment, "data_url");
        attachmentUrl = await getDownloadURL(
          ref(storageService, attachmentRef)
        );
      }
      const sTwitterObj = {
        text: stwitter,
        createdAt: Date.now(),
        creatorID: userObj.uid,
        attachmentUrl,
      };
      await dbService.collection("simple-twitter").add(sTwitterObj);
      setSTwitter("");
      setAttachment("");
    }
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
  const onClearAttachmentClick = () => setAttachment("");
  return (
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
          <img src={attachment} width="100px" height="100px" alt="attachment" />
          <button onClick={onClearAttachmentClick}>Clear</button>
        </>
      )}
    </form>
  );
}

export default STwitterFactory;
