import type { FormItemRule } from "element-plus";

interface LengthRange {
  /** 最小长度 */
  min: number;
  /** 最大长度 */
  max: number;
  /** 错误提示 */
  message?: string;
}

/**
 * 返回 EP 表单验证的规则
 */
export const useValidator = () => {
  /**
   * 必填项验证
   *
   * @param message 错误提示
   */
  const required = (message?: string): FormItemRule => {
    return {
      required: true,
      message: message || "该项为必填项",
    };
  };

  /**
   * 长度范围验证
   *
   * @param options 配置
   */
  const lengthRange = (options: LengthRange): FormItemRule => {
    const { min, max, message } = options;

    return {
      min,
      max,
      message: message || `长度在 ${min} 到 ${max} 个字符`,
    };
  };

  /**
   * 空格验证
   *
   * @param message 错误提示
   */
  const notSpace = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (val?.indexOf(" ") !== -1) return callback(new Error(message || "不能包含空格"));
        return callback();
      },
    };
  };

  /**
   * 特殊字符验证
   *
   * @param message 错误提示
   */
  const notSpecialCharacters = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) return callback(new Error(message || "不能包含特殊字符"));
        return callback();
      },
    };
  };

  /**
   * 手机号验证
   *
   * @param message 错误提示
   */
  const phone = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();
        if (!/^1[3-9]\d{9}$/.test(val)) return callback(new Error(message || "请输入正确的手机号码"));
        return callback();
      },
    };
  };

  /**
   * 邮箱验证
   *
   * @param message 错误提示
   */
  const email = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();
        const trimmedValue = val.trim();
        const regex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!regex.test(trimmedValue) && trimmedValue < 254) return callback(new Error(message || "请输入正确的邮箱"));
        return callback();
      },
    };
  };

  /**
   * 密码验证
   *
   * @param password 密码
   * @param message 错误提示
   */
  const password = (min = 6, max = 20, message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();

        const trimmedValue = val.trim();

        // 长度检查
        if (trimmedValue.length < min || trimmedValue.length > max) {
          return callback(new Error(message || `密码长度在 ${min} 到 ${max} 个字符`));
        }

        // 必须包含字母和数字
        const hasLetter = /[a-zA-Z]/.test(trimmedValue);
        const hasNumber = /\d/.test(trimmedValue);
        if (!hasLetter || !hasNumber) return callback(new Error(message || "密码必须包含字母和数字"));

        return callback();
      },
    };
  };

  /**
   * 强密码验证
   *
   * @param min 最小长度
   * @param max 最大长度
   * @param message 错误提示
   */
  const strongPassword = (min = 8, max = 20, message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();

        const trimmedValue = val.trim();

        // 长度检查
        if (trimmedValue.length < min || trimmedValue.length > max) {
          return callback(new Error(message || `密码长度在 ${min} 到 ${max} 个字符`));
        }

        // 必须包含字母、数字和特殊字符
        const hasLetter = /[a-zA-Z]/.test(trimmedValue);
        const hasNumber = /\d/.test(trimmedValue);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedValue);
        if (!hasLetter || !hasNumber || !hasSpecialChar) {
          return callback(new Error(message || "密码必须包含字母、数字和特殊字符"));
        }

        return callback();
      },
    };
  };

  /**
   * 身份证号
   *
   * @param message 错误提示
   */
  const chineseIdCard = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();

        const trimmedValue = val.trim();
        const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[0-1])\d{3}[0-9Xx]$/;

        if (!regex.test(trimmedValue)) return callback(new Error(message || "请输入正确的身份证号码"));

        // 验证校验码
        const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const checkCodes = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];

        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(trimmedValue[i]) * weights[i];
        }

        const checkCode = checkCodes[sum % 11];
        if (checkCode !== trimmedValue[17].toUpperCase()) {
          return callback(new Error(message || "请输入正确的身份证号码"));
        }

        return callback();
      },
    };
  };

  /**
   * 银行卡号验证
   *
   * @param message 错误提示
   */
  const bankCard = (message?: string): FormItemRule => {
    return {
      validator: (_, val, callback) => {
        if (!val) return callback();

        const trimmedValue = val.trim();

        const regex = /^[1-9]\d{15}$/;
        if (!regex.test(trimmedValue)) return callback(new Error(message || "请输入正确的银行卡号"));

        // Luhn 算法验证
        let sum = 0;
        let shouldDouble = false;

        for (let i = trimmedValue.length - 1; i >= 0; i--) {
          let digit = parseInt(trimmedValue[i]);

          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit = (digit % 10) + 1;
          }

          sum += digit;
          shouldDouble = !shouldDouble;
        }

        if (sum % 10 !== 0) return callback(new Error(message || "请输入正确的银行卡号"));

        return callback();
      },
    };
  };

  /**
   * 最大长度
   *
   * @param max 最大长度
   * @param message 错误提示
   */
  const maxLength = (max: number, message?: string): FormItemRule => {
    return {
      max,
      message: message || `长度不能超过 ${max} 个字符`,
    };
  };

  /**
   * 最小长度
   *
   * @param min 最小长度
   * @param message 错误提示
   */
  const minLength = (min: number, message?: string): FormItemRule => {
    return {
      min,
      message: message || `长度不能小于 ${min} 个字符`,
    };
  };

  return {
    required,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    phone,
    email,
    password,
    strongPassword,
    chineseIdCard,
    bankCard,
    maxLength,
    minLength,
  };
};
