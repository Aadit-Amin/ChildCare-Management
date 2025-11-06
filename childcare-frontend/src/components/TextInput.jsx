import React, { forwardRef } from "react";

/**
 * Reusable TextInput component with proper icon spacing
 * Icons are always visible and positioned outside the text area
 */
const TextInput = forwardRef(({
  type = "text",
  name,
  id,
  value,
  placeholder,
  onChange,
  onBlur,
  className = "",
  icon: Icon,
  iconPosition = "left",
  rightIcon: RightIcon,
  showPasswordToggle = false,
  onPasswordToggle,
  required = false,
  disabled = false,
  readOnly = false,
  ...rest
}, ref) => {

  // Determine padding based on icons
  const hasLeftIcon = Icon && iconPosition === "left";
  const hasRightIcon = showPasswordToggle || RightIcon || (Icon && iconPosition === "right");
  
  // Force padding - do not let className override
  const leftPad = hasLeftIcon ? "!pl-12" : "";
  const rightPad = hasRightIcon ? "!pr-12" : "";

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      {Icon && iconPosition === "left" && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      {/* Input */}
      <input
        ref={ref}
        type={type}
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${className} ${leftPad} ${rightPad} ${
          readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...rest}
      />

      {/* Right Icon */}
      {Icon && iconPosition === "right" && !showPasswordToggle && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      )}
      
      {/* Password Toggle Button */}
      {showPasswordToggle && onPasswordToggle && RightIcon && (
        <button
          type="button"
          onClick={onPasswordToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RightIcon className="w-5 h-5" />
        </button>
      )}
      
      {/* Static Right Icon */}
      {RightIcon && !showPasswordToggle && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <RightIcon className="w-5 h-5 text-gray-400" />
        </div>
      )}
    </div>
  );
});

TextInput.displayName = "TextInput";

export default TextInput;