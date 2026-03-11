"use client";
export default function FormInput({
  label,
  name,
  type = "text",
  required = false,
  defaultValue = "",
  error,
  placeholder = "",
  textarea = false,
}) {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>

      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`textarea textarea-bordered w-full ${
            error ? "textarea-error" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={`input input-bordered w-full ${
            error ? "input-error" : ""
          }`}
        />
      )}

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
