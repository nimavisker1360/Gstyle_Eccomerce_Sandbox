"use client";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  // Calculate password strength
  const calculateStrength = (pass: string) => {
    if (!pass)
      return { score: 0, color: "bg-gray-200", text: "خالی", width: "0%" };

    let score = 0;

    // Length check
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    // Additional length bonus
    if (pass.length >= 16) score += 1;

    // Determine color and text based on score
    let color, text, width;

    if (score <= 2) {
      color = "bg-red-500";
      text = "ضعیف";
      width = "25%";
    } else if (score <= 3) {
      color = "bg-orange-500";
      text = "متوسط";
      width = "50%";
    } else if (score <= 4) {
      color = "bg-yellow-500";
      text = "خوب";
      width = "75%";
    } else if (score <= 5) {
      color = "bg-lime-500";
      text = "قوی";
      width = "90%";
    } else {
      color = "bg-green-500";
      text = "خیلی قوی";
      width = "100%";
    }

    return { score, color, text, width };
  };

  const strength = calculateStrength(password);

  return (
    <div className="w-full space-y-3 mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="text-sm font-medium text-gray-700 mb-2">قدرت رمز عبور</h4>

      {/* Password strength bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-500 ease-out ${strength.color} shadow-sm`}
          style={{ width: strength.width }}
        />
      </div>

      {/* Strength text and score */}
      <div className="flex items-center justify-between text-sm">
        <span
          className={`font-semibold ${strength.color.replace("bg-", "text-")}`}
        >
          {strength.text}
        </span>
        <span className="text-gray-500 font-medium">{strength.score}/6</span>
      </div>
    </div>
  );
}
