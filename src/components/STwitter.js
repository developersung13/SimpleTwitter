import { deleteObject, ref } from "@firebase/storage";
import { dbService, storageService } from "fbase";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
    <div className="sTwitter">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container sTwitterEdit">
            <input
              type="text"
              placeholder="Edit your message"
              value={newSTwitter}
              required
              onChange={onChange}
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update message" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{sTwitterObj.text}</h4>
          {sTwitterObj.attachmentUrl && (
            <img src={sTwitterObj.attachmentUrl} alt="" />
          )}
          {isOwner && (
            <>
              <div className="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default STwitter;
