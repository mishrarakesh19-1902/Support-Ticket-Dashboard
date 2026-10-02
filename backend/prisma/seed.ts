import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate dates spread across the last 60 days
function daysAgo(days: number, hoursOffset: number = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

const seedTickets = [
  // HIGH Priority - OPEN
  {
    title: 'Payment gateway failing for European customers',
    description: 'Multiple users in the EU region report 502 errors when checking out with 3D Secure enabled credit cards.',
    customerEmail: 'sarah.chen@techcorp.io',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: daysAgo(1, 2),
  },
  {
    title: 'Database connection pool exhausted during peak traffic',
    description: 'We are observing timeout errors across all API endpoints during our 2 PM UTC spike. Need immediate investigation.',
    customerEmail: 'dev@startup.co',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: daysAgo(2, 5),
  },
  {
    title: 'SSO Login loop for Okta users',
    description: 'Users attempting SAML 2.0 authentication get redirected back to the login page without session cookies being set.',
    customerEmail: 'alex.miller@acme.org',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: daysAgo(5, 1),
  },
  {
    title: 'Data export generating corrupt ZIP files',
    description: 'Downloading full workspace archives yields an unreadable archive of 0 bytes for accounts with >50k records.',
    customerEmail: 'elena.rostova@globalfin.com',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: daysAgo(8, 3),
  },

  // HIGH Priority - IN_PROGRESS
  {
    title: 'Webhook delivery delays exceeding 15 minutes',
    description: 'Events generated in production are queued up and taking up to 20 minutes to reach customer webhooks.',
    customerEmail: 'dev@startup.co',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(4, 6),
  },
  {
    title: 'Critical security warning on TLS certificate renewal',
    description: 'Automated Let’s Encrypt renewal failed due to DNS validation error. Certificate expires in 48 hours.',
    customerEmail: 'security@enterprisesec.net',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(6, 4),
  },
  {
    title: 'API rate limits triggered unexpectedly for Enterprise tier',
    description: 'Enterprise account with unlimited tier is hitting HTTP 429 after 500 requests per minute.',
    customerEmail: 'sarah.chen@techcorp.io',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(12, 8),
  },

  // HIGH Priority - RESOLVED
  {
    title: 'Production outage on US-East region',
    description: 'Cloud provider outage impacted container cluster for 24 minutes. Failover routing has restored operations.',
    customerEmail: 'ops@cloudscale.io',
    priority: 'HIGH',
    status: 'RESOLVED',
    createdAt: daysAgo(20, 10),
  },
  {
    title: 'Memory leak in real-time notification service',
    description: 'WebSocket nodes were crashing due to uncollected listeners on disconnected sockets. Patch deployed in v2.4.1.',
    customerEmail: 'alex.miller@acme.org',
    priority: 'HIGH',
    status: 'RESOLVED',
    createdAt: daysAgo(25, 4),
  },
  {
    title: 'Invoice calculation error applying negative tax rate',
    description: 'Billing engine calculated tax discounts inversely for Canadian clients. Credit notes issued and formula fixed.',
    customerEmail: 'billing@megacorp.com',
    priority: 'HIGH',
    status: 'RESOLVED',
    createdAt: daysAgo(35, 2),
  },

  // MEDIUM Priority - OPEN
  {
    title: 'Cannot invite team members with plus sign in email',
    description: 'Validation regex rejects emails like user+test@example.com when submitting the team invite form.',
    customerEmail: 'jordan.lee@growthlabs.co',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: daysAgo(3, 1),
  },
  {
    title: 'Dashboard charts render blank on Safari 16',
    description: 'Canvas rendering fallback fails on older WebKit engines without showing an error message.',
    customerEmail: 'michael.b@designstudio.design',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: daysAgo(7, 3),
  },
  {
    title: 'CSV import skips rows containing special characters',
    description: 'Rows with umlauts or accented characters are dropped silently without appearing in the import error report.',
    customerEmail: 'elena.rostova@globalfin.com',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: daysAgo(10, 5),
  },
  {
    title: 'Custom domain SSL verification is stuck on pending',
    description: 'CNAME record was configured 48 hours ago, but dashboard still shows "Verifying DNS propagation".',
    customerEmail: 'admin@quickshop.shop',
    priority: 'MEDIUM',
    status: 'OPEN',
    createdAt: daysAgo(14, 2),
  },

  // MEDIUM Priority - IN_PROGRESS
  {
    title: 'Email notification preferences not saving',
    description: 'Toggling off weekly digest emails reverts back to enabled upon refreshing the settings page.',
    customerEmail: 'alex.miller@acme.org',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(9, 2),
  },
  {
    title: 'Slow query on audit log history table',
    description: 'Loading audit events for organizations with over 100 users takes ~6 seconds to respond.',
    customerEmail: 'dev@startup.co',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(15, 6),
  },
  {
    title: 'Slack integration disconnects periodically',
    description: 'OAuth token refresh fails intermittently, requiring manual re-authorization every 7 days.',
    customerEmail: 'jordan.lee@growthlabs.co',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(18, 4),
  },
  {
    title: 'Search results pagination count is inaccurate with active filters',
    description: 'Total item counter displays 142 items when only 18 items match the selected tag filter.',
    customerEmail: 'sarah.chen@techcorp.io',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(22, 1),
  },

  // MEDIUM Priority - RESOLVED
  {
    title: 'Profile avatar upload rejects valid PNG files',
    description: 'MIME type detector misclassified 32-bit transparent PNGs as unsupported binary format.',
    customerEmail: 'maria.g@creatives.io',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: daysAgo(30, 7),
  },
  {
    title: 'Zapier trigger missing custom metadata fields',
    description: 'Payload schema updated to include all custom key-value attributes.',
    customerEmail: 'dev@startup.co',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: daysAgo(40, 5),
  },
  {
    title: 'Broken pagination links in email digest footer',
    description: 'URL parameters were double URL-encoded causing a 400 Bad Request error on the landing page.',
    customerEmail: 'newsletter@mediahub.com',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: daysAgo(48, 3),
  },
  {
    title: 'Timezone discrepancy on scheduled report emails',
    description: 'Reports scheduled for 9 AM EST were sent at 9 AM UTC due to server default timezone setting.',
    customerEmail: 'elena.rostova@globalfin.com',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    createdAt: daysAgo(55, 9),
  },

  // LOW Priority - OPEN
  {
    title: 'Dark mode contrast issue on disabled button text',
    description: 'Disabled buttons have a contrast ratio of 1.8:1 against the dark background, failing WCAG AA guidelines.',
    customerEmail: 'accessibility@inclusive.org',
    priority: 'LOW',
    status: 'OPEN',
    createdAt: daysAgo(11, 2),
  },
  {
    title: 'Typo in billing settings help tooltip',
    description: 'Tooltip says "pro-rated subcription" instead of "subscription".',
    customerEmail: 'typo-hunter@grammargeek.com',
    priority: 'LOW',
    status: 'OPEN',
    createdAt: daysAgo(16, 4),
  },
  {
    title: 'Keyboard shortcut conflict with browser back button',
    description: 'Pressing Alt+Left in the table editor navigates the browser backwards instead of jumping to previous cell.',
    customerEmail: 'poweruser@productivity.net',
    priority: 'LOW',
    status: 'OPEN',
    createdAt: daysAgo(21, 6),
  },
  {
    title: 'Favicon missing on password reset confirmation page',
    description: 'The static reset success page links to a missing /favicon-v2.ico asset.',
    customerEmail: 'jordan.lee@growthlabs.co',
    priority: 'LOW',
    status: 'OPEN',
    createdAt: daysAgo(28, 1),
  },

  // LOW Priority - IN_PROGRESS
  {
    title: 'Request for customizable date format (DD/MM/YYYY vs MM/DD/YYYY)',
    description: 'UK and Australian customers requested a preference option to display dates in British English standard format.',
    customerEmail: 'sarah.chen@techcorp.io',
    priority: 'LOW',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(26, 3),
  },
  {
    title: 'Add tooltip explaining seat allocation limits',
    description: 'Users get confused when they cannot add more seats without upgrading plan tier.',
    customerEmail: 'support-inquiry@saasco.io',
    priority: 'LOW',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(33, 8),
  },
  {
    title: 'Sort order in organization dropdown should be alphabetical',
    description: 'Currently orgs are ordered by insertion ID which creates a chaotic list for managers with >15 accounts.',
    customerEmail: 'alex.miller@acme.org',
    priority: 'LOW',
    status: 'IN_PROGRESS',
    createdAt: daysAgo(38, 4),
  },

  // LOW Priority - RESOLVED
  {
    title: 'Clarify cancellation policy in terms of service link',
    description: 'Updated direct link to target section 4.2 in modern terms modal.',
    customerEmail: 'legal@partnerships.com',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: daysAgo(45, 6),
  },
  {
    title: 'Update copyright year in email templates footer',
    description: 'Replaced hardcoded 2023 with dynamic current year template tag.',
    customerEmail: 'sarah.chen@techcorp.io',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: daysAgo(52, 2),
  },
  {
    title: 'Add Markdown formatting preview to ticket description box',
    description: 'Added a toggle tab for live markdown preview in support editor.',
    customerEmail: 'elena.rostova@globalfin.com',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: daysAgo(58, 5),
  },
  {
    title: 'Refactor legacy CSS reset to modernize browser support',
    description: 'Replaced custom normalize stylesheet with modern CSS reset utility.',
    customerEmail: 'dev@startup.co',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: daysAgo(59, 11),
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing tickets and reset autoincrement ID sequence
  const deleted = await prisma.ticket.deleteMany();
  try {
    await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'tickets';");
  } catch (e) {
    // sqlite_sequence may not exist if no autoincrement was used yet
  }
  console.log(`Deleted ${deleted.count} existing tickets.`);

  // Insert seed tickets
  for (const ticket of seedTickets) {
    await prisma.ticket.create({
      data: {
        title: ticket.title,
        description: ticket.description,
        customerEmail: ticket.customerEmail,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        updatedAt: ticket.createdAt,
      },
    });
  }

  const total = await prisma.ticket.count();
  console.log(`✅ Seed complete! Inserted ${total} support tickets with IDs starting from 1.`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
