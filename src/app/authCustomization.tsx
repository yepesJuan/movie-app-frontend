import { AuthenticatorProps } from "@aws-amplify/ui-react";

const colors = {
  primary: "#093545", // Background
  buttonPrimary: "#2AD17E", // Primary button background
  inputBg: "#224957", // Input field background
  error: "#eb5758", // Error color
};

export const authStyles = `
/* Customize Amplify Authenticator Styles */

html,
[data-amplify-theme] {
  font-family: "Montserrat", ui-sans-serif, system-ui, sans-serif !important;
}

[data-amplify-authenticator] {
  /* Router: the container for the sign in/up form */
  --amplify-components-authenticator-router-background-color: ${colors.primary};
  --amplify-components-authenticator-router-box-shadow: none;
  --amplify-components-authenticator-router-border-width: 0;
  --amplify-components-button-primary-background-color: ${colors.buttonPrimary};
  --amplify-components-button-primary-hover-background-color: ${colors.buttonPrimary};
  --amplify-components-button-primary-color: white;
  --amplify-components-button-color: white;
  --amplify-components-button-link-color: white;
  --amplify-components-button-border-color: ${colors.primary};

  
  /* Tabs (Sign In / Create Account) */
  --amplify-components-tabs-item-color: white;
  --amplify-components-tabs-item-active-color: white;
  --amplify-components-tabs-item-hover-color: silver;
  --amplify-components-tabs-item-active-border-color: ${colors.buttonPrimary};

  font-family: 'Montserrat', sans-serif;
  
  .amplify-tabs__item {
    font-size: 1.5rem;
    }

  .amplify-input {
  background-color: ${colors.inputBg} !important;
  color: white !important;
  border: none !important;
  }

  .amplify-field__show-password {
  background-color: ${colors.inputBg} !important;
  border: none;
  color: white;
  }

  .amplify-heading {
  color: white
  }

  .amplify-label {
  display: none;
  }

  .amplify-text {
  color: white;
  }

  .amplify-heading--3 {
  color: white;
  text-align: center;
  }

  .amplify-text--error {
  color: ${colors.error};
  }

  .amplify-input--error {
  border-color: ${colors.error} !important;
  }
  }
  `;

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
