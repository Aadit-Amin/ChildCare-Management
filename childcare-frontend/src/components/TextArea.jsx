import React, { forwardRef } from "react";

/**
 * Reusable TextArea component with proper icon spacing
 * Icons are always visible and positioned outside the text area
 */
const TextArea = forwardRef(({
  name,
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  className = "",
  icon: Icon,
  iconPosition = "left",
  rows = 3,
  required = false,
  disabled = false,
  readOnly = false,
  ...rest
}, ref) => {

  // Determine padding based on icons
  const hasLeftIcon = Icon && iconPosition === "left";
  const hasRightIcon = Icon && iconPosition === "right";
  
  // Force padding - do not let className override
  const leftPad = hasLeftIcon ? "!pl-12" : "";
  const rightPad = hasRightIcon ? "!pr-12" : "";

  return (
    <div className="relative w-full">
      {/* Icon */}
      {Icon && (
        <div className={`absolute ${iconPosition === "left" ? "left-3" : "right-3"} top-3 pointer-events-none`}>
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      {/* Textarea */}
      <textarea
        ref={ref}
        name={name}
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none ${className} ${leftPad} ${rightPad} ${
          readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...rest}
      />
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
