import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { useState } from "react";
function STwitter({ sTwitterObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newSTwitter, setNewSTwitter] = useState(sTwitterObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this message?");
    if (ok) {
      await dbService.doc(`simple-twitter/${sTwitterObj.id}`).delete();
      await deleteObject(ref(storageService, sTwitterObj.attachmentUrl));
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`simple-twitter/${sTwitterObj.id}`).update({
      text: newSTwitter,
    });
    setEditing(false);
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewSTwitter(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your message"
              value={newSTwitter}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update message" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{sTwitterObj.text}</h4>
          {sTwitterObj.attachmentUrl && (
            <img
              src={sTwitterObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="attachment"
            />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit message</button>
              <button onClick={onDeleteClick}>Delete message</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default STwitter;
