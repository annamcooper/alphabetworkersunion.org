import Stripe from 'stripe';

import { footer } from './footer';
import { makeHtmlResponse, renderDocument } from './html';
import { cwaAwuLogo } from './logo';

export async function memberPage(customerId: string, env: Env): Promise<Response> {
  const sourceIds = await getSourceIds(customerId, env);
  return makeHtmlResponse(
    renderDocument(
      sourceIds.length ? (
        <form
          method="post"
          action=""
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto',
            gap: 'var(--container-padding)',
            padding: 'var(--container-padding)',
            maxWidth: 'min(600px, 90vw)',
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          {cwaAwuLogo()}
          <h1>AWU-CWA Dues Profile</h1>
          <p
            style={{
              background: 'var(--yellow-faded)',
              border: 'solid 2px var(--yellow)',
              padding: 'var(--text-padding)',
              borderRadius: 'var(--border-radius)',
              maxWidth: 'min(700px, 90vw)',
            }}
          >
            ℹ️
            <strong>Legacy billing must be removed.</strong>
            <br />
            <br />
            <strong>NOTE:</strong> The payment method associated with your account was configured through a legacy bank account payment
            integration. To update your payment method, click this button to first disconnect your existing payment method. You will then be
            directed to the Stripe Billing Portal to add a new payment method.
          </p>
          <button
            type="submit"
            name="delete_source"
            value="1"
            style={{
              fontSize: '1.1em',
              background: 'var(--primary)',
              padding: '20px 30px',
              border: 0,
              borderRadius: 50,
              color: 'var(--white)',
            }}
          >
            Disconnect Existing Payment Method
          </button>
          <p>
            To view and update your mailing/billing address or retrieve receipts of previous dues charges, navigate to the Stripe Billing
            Portal:
          </p>
          <a
            href="/stripe-portal"
            style={{
              fontSize: '1.1em',
              background: 'var(--primary)',
              padding: '20px 30px',
              border: 0,
              borderRadius: 50,
              color: 'var(--white)',
              textDecoration: 'none',
            }}
          >
            Open Stripe Billing Portal
          </a>
          <p>
            If there are other membership changes you would like to make, such as canceling your membership (which includes canceling dues
            charges), or updating your office location or job information, please fill out the change form:&#32;
            <a href="https://go.awu.fyi/change">go.awu.fyi/change</a>
          </p>
          {footer()}
        </form>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto',
            gap: 'var(--container-padding)',
            padding: 'var(--container-padding)',
            maxWidth: 'min(600px, 90vw)',
            background: 'var(--white)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          {cwaAwuLogo()}
          <h1>AWU-CWA Dues Profile</h1>
          <p>
            To update your payment method on file, view and update your mailing/billing address or retrieve receipts of previous dues
            charges, navigate to the Stripe Billing Portal:
          </p>
          <a
            href="/stripe-portal"
            style={{
              fontSize: '1.1em',
              background: 'var(--primary)',
              padding: '20px 30px',
              border: 0,
              borderRadius: 50,
              color: 'var(--white)',
              textDecoration: 'none',
            }}
          >
            Open Stripe Billing Portal
          </a>
          <p>
            If there are other membership changes you would like to make, such as canceling your membership (which includes canceling dues
            charges), or updating your office location or job information, please fill out the change form:&#32;
            <a href="https://go.awu.fyi/change">go.awu.fyi/change</a>
          </p>
          {footer()}
        </div>
      ),
    ),
  );
}

/**
 * Get all source IDs for legacy ACH integrations.
 */
export async function getSourceIds(customerId: string, env: Env): Promise<string[]> {
  const stripe = new Stripe(env.STRIPE_API_KEY);
  const customer = await stripe.customers.retrieve(customerId, { expand: ['sources'] });
  if ('sources' in customer) {
    const sources: unknown = customer.sources;
    console.debug(customer.sources);
    if (isExpandedSource(sources)) {
      return sources.data.filter((source) => source.object === 'bank_account').map(({ id }) => id);
    }
  }
  return [];
}

interface ExpandedSource {
  data: ReadonlyArray<{ id: string; [key: string]: unknown }>;
}

function isExpandedSource(sources: unknown): sources is ExpandedSource {
  if (typeof sources === 'object' && sources !== null && 'data' in sources) {
    const data = sources.data;
    if (data instanceof Array) {
      return data.every((source) => typeof source === 'object' && source !== null && 'id' in source);
    }
  }
  return false;
}
