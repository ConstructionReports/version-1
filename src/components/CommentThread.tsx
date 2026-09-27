import { useState, type FormEvent } from "react";
import { newId } from "../lib/format";
import { addTrackerComment } from "../lib/storage";
import type { Manager, TrackerComment } from "../types";

type Props = {
  trackerId: string;
  comments: TrackerComment[];
  manager: Manager;
  onAdded: () => void;
};

export function CommentThread({ trackerId, comments, manager, onAdded }: Props) {
  const [body, setBody] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    addTrackerComment(trackerId, {
      id: newId("cmt"),
      managerId: manager.id,
      authorName: manager.name,
      body: body.trim(),
      at: new Date().toISOString(),
    });
    setBody("");
    onAdded();
  }

  return (
    <section className="panel">
      <h3>Manager notes</h3>
      <p className="muted">Small-team collaboration on this tracker. Signed in as {manager.name}.</p>
      {comments.length === 0 ? <p className="meta">No notes yet.</p> : null}
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id}>
            <strong>{comment.authorName}</strong>
            <span className="meta"> · {new Date(comment.at).toLocaleString()}</span>
            <p>{comment.body}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="actions" style={{ marginTop: 12 }}>
        <input
          aria-label="Add a manager note"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Leave a note for the other managers"
        />
        <button className="btn" type="submit">
          Post
        </button>
      </form>
    </section>
  );
}
