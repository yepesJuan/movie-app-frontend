import { AuthenticatorProps } from "@aws-amplify/ui-react";

export const formFields: AuthenticatorProps["formFields"] = {
  signIn: {
    username: {
      labelHidden: true,
      placeholder: "Email",
    },
    password: {
      labelHidden: true,
      placeholder: "Password",
    },
  },
  signUp: {
    email: {
      labelHidden: true,
      placeholder: "Email",
    },
    password: {
      labelHidden: true,
      placeholder: "Password",
    },
    confirm_password: {
      labelHidden: true,
      placeholder: "Confirm Password",
    },
  },
  forgotPassword: {
    username: {
      labelHidden: true,
      placeholder: "Email",
    },
  },
};

export const authStyles = `
  /* Customize Amplify Authenticator Styles */
  [data-amplify-authenticator] {
    /* Router: the container for the sign in/up form */
    --amplify-components-authenticator-router-background-color: #093545;
    --amplify-components-authenticator-router-box-shadow: none;
    --amplify-components-authenticator-router-border-width: 0;
    --amplify-components-tabs-item-hover-color: silver;
    --amplify-components-button-primary-hover-background-color: #2ad17e;

    /* Form padding */
    --amplify-components-authenticator-form-padding: var(
        --amplify-space-medium
      )
      var(--amplify-space-xl) var(--amplify-space-medium);

    /* Tabs (Sign In / Create Account) */
    --amplify-components-tabs-item-color: white;
    --amplify-components-tabs-item-active-color: white;
    --amplify-components-tabs-item-active-border-color: white;

    /* Link styling (if any) */
    --amplify-components-button-link-color: white;
    --amplify-components-button-primary-background-color: #2ad17e;

    .amplify-tabs__item {
      font-size: 1.5rem;
    }

    .amplify-tabs__item--active {
      border-color: #2ad17e;
    }

    .amplify-input {
      /* Fallback in case variables aren't applied */
      background-color: #224957 !important;
      color: white !important;
      border: none !important;
    }

    .amplify-field__show-password {
      background-color: #224957 !important;
      border: none;
      color: white;
    }

    .amplify-heading--3 {
      color: white;
      text-align: center;
    }

    .amplify-text--error {
      color: #eb5758;
    }

    .amplify-input--error {
      border-color: #eb5758 !important;
    }
  }
`;
