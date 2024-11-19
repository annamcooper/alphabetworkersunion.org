import { footer } from './footer';
import { makeHtmlResponse, renderDocument } from './html';
import { cwaAwuLogo } from './logo';

export function loginPage(params: URLSearchParams): Response {
  const linkSent = params.has('link_sent');
  return makeHtmlResponse(
    renderDocument(
      linkSent ? (
        <div
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--container-padding)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--container-padding)',
            alignItems: 'stretch',
            maxWidth: 'min(600px, 90vw)',
            margin: '0 auto',
          }}
        >
          {cwaAwuLogo()}
          <h1>Login Link Sent to Email</h1>
          <p>
            If the email address you entered is associated with an AWU-CWA membership, a login link has been sent to that email address.
            Please check your email for next steps.
            <br />
            <br />
            This tab may be closed.
            <br />
            <br />
            <a href=".">Start over</a>
          </p>
          {footer()}
        </div>
      ) : (
        <form
          action=""
          method="post"
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--container-padding)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--container-padding)',
            alignItems: 'stretch',
            maxWidth: 'min(600px, 90vw)',
            margin: '0 auto',
          }}
        >
          {cwaAwuLogo()}
          <h1>Log in to your AWU-CWA dues profile</h1>
          <p>
            This page allows you to update your payment method and mailing/billing address, as well as retrieve receipts of your previous
            dues charges. This page is available to both current and former AWU-CWA members.
          </p>
          <p>
            Enter the <em>personal</em> email address associated with your AWU-CWA membership. We'll send you a link to log in.
          </p>
          <input
            type="email"
            name="email"
            style={{
              fontSize: '1.4em',
              padding: 'var(--text-padding)',
              borderRadius: 'var(--border-radius)',
              border: 'solid 2px var(--gray-1)',
            }}
          />
          <button
            type="submit"
            style={{
              fontSize: '1.1em',
              background: 'var(--primary)',
              padding: '20px 30px',
              border: 0,
              borderRadius: 50,
              color: 'var(--white)',
            }}
          >
            Send Login Link
          </button>
          {footer()}
        </form>
      ),
    ),
  );
}
