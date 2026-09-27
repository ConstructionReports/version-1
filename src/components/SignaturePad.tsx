import { useEffect, useRef, useState, type PointerEvent } from "react";
import { SIGNATURE_INTENT } from "../types";
import type { TrackerSignature } from "../types";

type Props = {
  value: TrackerSignature;
  onChange: (next: TrackerSignature) => void;
};

export function SignaturePad({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [typedName, setTypedName] = useState(value.typedName || value.signerName);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.strokeStyle = "#16140f";
    context.lineWidth = 2;
    context.lineCap = "round";
    if (value.imageDataUrl) {
      const image = new Image();
      image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.src = value.imageDataUrl;
    }
  }, [value.imageDataUrl]);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const box = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) / box.width) * canvas.width,
      y: ((event.clientY - box.top) / box.height) * canvas.height,
    };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!context) return;
    drawing.current = true;
    const { x, y } = point(event);
    context.beginPath();
    context.moveTo(x, y);
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function end() {
    drawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    onChange({
      ...value,
      method: "drawn",
      imageDataUrl: canvas.toDataURL("image/png"),
    });
  }

  function clearPad() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
    onChange({
      ...value,
      status: "unsigned",
      method: "",
      imageDataUrl: "",
      typedName: "",
      intentAccepted: false,
      signedAt: "",
    });
  }

  function applyTyped() {
    onChange({
      ...value,
      method: "typed",
      typedName,
      signerName: typedName,
      imageDataUrl: "",
    });
  }

  function sign() {
    if (!value.intentAccepted) return;
    const name = value.method === "typed" ? typedName : value.signerName;
    if (!name || (value.method === "drawn" && !value.imageDataUrl) || (value.method === "typed" && !typedName)) {
      return;
    }
    onChange({
      ...value,
      status: "signed",
      signerName: name,
      typedName,
      signedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="signature-pad">
      <p className="muted">{SIGNATURE_INTENT}</p>
      <label className="check">
        <input
          type="checkbox"
          checked={value.intentAccepted}
          onChange={(event) => onChange({ ...value, intentAccepted: event.target.checked })}
        />
        I accept this statement and intend to sign.
      </label>
      <div className="form-grid">
        <div>
          <label htmlFor="signer-name">Signer name</label>
          <input
            id="signer-name"
            value={value.signerName}
            onChange={(event) => onChange({ ...value, signerName: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="signer-role">Role</label>
          <input
            id="signer-role"
            value={value.signerRole}
            onChange={(event) => onChange({ ...value, signerRole: event.target.value })}
          />
        </div>
      </div>
      <label htmlFor="typed-sign">Type signature</label>
      <div className="actions">
        <input
          id="typed-sign"
          className="serif"
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
          placeholder="Full legal name"
        />
        <button className="btn secondary" type="button" onClick={applyTyped}>
          Use typed name
        </button>
      </div>
      <p className="meta">Or draw</p>
      <canvas
        ref={canvasRef}
        width={640}
        height={160}
        className="signature-canvas"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
      />
      <div className="actions">
        <button className="btn secondary" type="button" onClick={clearPad}>
          Clear
        </button>
        <button className="btn" type="button" onClick={sign} disabled={!value.intentAccepted}>
          Sign tracker
        </button>
      </div>
      {value.status === "signed" ? (
        <p className="status submitted">
          Signed {value.signedAt ? new Date(value.signedAt).toLocaleString() : ""} · {value.method}
        </p>
      ) : (
        <p className="meta">Unsigned — infrastructure is ready for a later provider hook-up.</p>
      )}
    </div>
  );
}
