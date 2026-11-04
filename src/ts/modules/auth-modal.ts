import { login, register, type AuthResult } from '../services/auth';

type AuthMode = 'login' | 'register';

const SUBMITTING_LABEL = 'Un momento…';

const errorFor = (input: HTMLInputElement): string => {
  if (input.validity.valueMissing) {
    if (input.name === 'consent') return 'Necesitamos tu consentimiento para crear la cuenta.';
    if (input.name === 'name') return 'Escribí tu nombre.';
    if (input.name === 'email') return 'Escribí tu correo electrónico.';
    return 'Escribí tu contraseña.';
  }
  if (input.validity.typeMismatch) return 'Revisá el correo, por ejemplo nombre@correo.com.';
  if (input.minLength > 0 && input.value.length < input.minLength) {
    return `La contraseña necesita al menos ${input.minLength} caracteres.`;
  }
  return '';
};

const showFieldError = (input: HTMLInputElement, message: string): void => {
  const error = input.form?.querySelector<HTMLElement>(`#${input.id}-error`);
  if (!error) return;
  error.textContent = message;
  error.hidden = message === '';
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
};

const inputsOf = (form: HTMLFormElement): HTMLInputElement[] => [...form.querySelectorAll('input')];

const submitForm = (mode: AuthMode, form: HTMLFormElement): Promise<AuthResult> => {
  const data = new FormData(form);
  const email = String(data.get('email'));
  const password = String(data.get('password'));
  return mode === 'login'
    ? login({ email, password })
    : register({ name: String(data.get('name')), email, password });
};

const resetPasswordToggles = (form: HTMLFormElement): void => {
  form.querySelectorAll<HTMLButtonElement>('[data-password-toggle]').forEach((toggle) => {
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Mostrar';
  });
  form.querySelectorAll<HTMLInputElement>('.field__password input').forEach((input) => {
    input.type = 'password';
  });
};

export const initAuthModal = (): void => {
  const modal = document.querySelector<HTMLDialogElement>('[data-auth-modal]');
  if (!modal) return;

  const forms = [...modal.querySelectorAll<HTMLFormElement>('[data-auth-form]')];

  const showMode = (mode: AuthMode): void => {
    forms.forEach((form) => {
      const active = form.dataset.authForm === mode;
      form.hidden = !active;
      if (active) {
        modal.setAttribute('aria-labelledby', `auth-${mode}-title`);
        form.querySelector('input')?.focus();
      }
    });
  };

  const resetForms = (): void => {
    forms.forEach((form) => {
      form.reset();
      inputsOf(form).forEach((input) => showFieldError(input, ''));
      resetPasswordToggles(form);
      const message = form.querySelector<HTMLElement>('[data-auth-message]');
      if (message) message.hidden = true;
    });
  };

  document.querySelectorAll<HTMLButtonElement>('[data-auth-open]').forEach((opener) => {
    opener.hidden = false;
    opener.addEventListener('click', () => {
      // El consentimiento nunca debe reaparecer marcado de una apertura anterior.
      resetForms();
      modal.showModal();
      showMode(opener.dataset.authOpen === 'register' ? 'register' : 'login');
    });
  });

  modal.querySelector('[data-auth-close]')?.addEventListener('click', () => modal.close());

  // Un clic en el fondo oscuro tiene como destino el propio dialog, no el panel.
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  modal.addEventListener('close', resetForms);

  modal.querySelectorAll<HTMLButtonElement>('[data-auth-switch]').forEach((button) => {
    button.addEventListener('click', () => {
      showMode(button.dataset.authSwitch === 'register' ? 'register' : 'login');
    });
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-password-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement?.querySelector('input');
      if (!input) return;
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(reveal));
      toggle.textContent = reveal ? 'Ocultar' : 'Mostrar';
    });
  });

  forms.forEach((form) => {
    const mode = form.dataset.authForm as AuthMode;
    const message = form.querySelector<HTMLElement>('[data-auth-message]');
    const submit = form.querySelector<HTMLButtonElement>('[data-auth-submit]');
    if (!message || !submit) return;
    const submitLabel = submit.textContent ?? '';

    // Una vez marcado un error, se corrige en vivo mientras la persona escribe.
    form.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.getAttribute('aria-invalid') === 'true') showFieldError(input, errorFor(input));
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      message.hidden = true;

      const inputs = inputsOf(form);
      inputs.forEach((input) => showFieldError(input, errorFor(input)));
      const firstInvalid = inputs.find((input) => errorFor(input) !== '');
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = SUBMITTING_LABEL;
      const result = await submitForm(mode, form);
      submit.disabled = false;
      submit.textContent = submitLabel;

      if (result.ok) {
        modal.close();
        return;
      }
      message.textContent = result.message;
      message.hidden = false;
    });
  });
};
