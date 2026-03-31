const {
  parseCommaSeparated,
  formatRecipientObjects,
  buildConditions,
  buildActions,
  buildExceptions,
  hasAnyCondition,
  hasAnyAction,
  VALID_IMPORTANCE,
  VALID_SENSITIVITY,
} = require('../../rules/rule-builder');
const { getFolderIdByName } = require('../../email/folder-utils');
const { checkRecipientAllowlist } = require('../../utils/safety');

jest.mock('../../email/folder-utils');
jest.mock('../../utils/safety', () => ({
  ...jest.requireActual('../../utils/safety'),
  checkRecipientAllowlist: jest.fn(),
}));

describe('parseCommaSeparated', () => {
  it('should return empty array for empty string', () => {
    expect(parseCommaSeparated('')).toEqual([]);
  });

  it('should return empty array for null/undefined', () => {
    expect(parseCommaSeparated(null)).toEqual([]);
    expect(parseCommaSeparated(undefined)).toEqual([]);
  });

  it('should parse single value', () => {
    expect(parseCommaSeparated('invoice')).toEqual(['invoice']);
  });

  it('should parse multiple values', () => {
    expect(parseCommaSeparated('invoice, receipt, payment')).toEqual([
      'invoice',
      'receipt',
      'payment',
    ]);
  });

  it('should trim whitespace', () => {
    expect(parseCommaSeparated('  hello ,  world  ')).toEqual([
      'hello',
      'world',
    ]);
  });

  it('should filter empty entries', () => {
    expect(parseCommaSeparated('a,,b, ,c')).toEqual(['a', 'b', 'c']);
  });
});

describe('formatRecipientObjects', () => {
  it('should format single email', () => {
    expect(formatRecipientObjects('user@example.com')).toEqual([
      { emailAddress: { address: 'user@example.com' } },
    ]);
  });

  it('should format multiple emails', () => {
    expect(formatRecipientObjects('a@example.com, b@example.com')).toEqual([
      { emailAddress: { address: 'a@example.com' } },
      { emailAddress: { address: 'b@example.com' } },
    ]);
  });

  it('should return empty array for empty string', () => {
    expect(formatRecipientObjects('')).toEqual([]);
  });
});

describe('buildConditions', () => {
  it('should build subjectContains from containsSubject with OR logic', () => {
    const { conditions, warnings } = buildConditions({
      containsSubject: 'invoice, receipt, payment',
    });

    expect(conditions.subjectContains).toEqual([
      'invoice',
      'receipt',
      'payment',
    ]);
    expect(warnings).toHaveLength(0);
  });

  it('should wrap single containsSubject in array', () => {
    const { conditions } = buildConditions({ containsSubject: 'newsletter' });
    expect(conditions.subjectContains).toEqual(['newsletter']);
  });

  it('should build bodyContains', () => {
    const { conditions } = buildConditions({ bodyContains: 'urgent, asap' });
    expect(conditions.bodyContains).toEqual(['urgent', 'asap']);
  });

  it('should build bodyOrSubjectContains', () => {
    const { conditions } = buildConditions({
      bodyOrSubjectContains: 'invoice, receipt',
    });
    expect(conditions.bodyOrSubjectContains).toEqual(['invoice', 'receipt']);
  });

  it('should build senderContains', () => {
    const { conditions } = buildConditions({
      senderContains: 'example.com, test.com',
    });
    expect(conditions.senderContains).toEqual(['example.com', 'test.com']);
  });

  it('should build recipientContains', () => {
    const { conditions } = buildConditions({
      recipientContains: 'team, support',
    });
    expect(conditions.recipientContains).toEqual(['team', 'support']);
  });

  it('should build fromAddresses as recipient objects', () => {
    const { conditions } = buildConditions({
      fromAddresses: 'a@example.com, b@example.com',
    });
    expect(conditions.fromAddresses).toEqual([
      { emailAddress: { address: 'a@example.com' } },
      { emailAddress: { address: 'b@example.com' } },
    ]);
  });

  it('should build sentToAddresses as recipient objects', () => {
    const { conditions } = buildConditions({
      sentToAddresses: 'team@example.com',
    });
    expect(conditions.sentToAddresses).toEqual([
      { emailAddress: { address: 'team@example.com' } },
    ]);
  });

  it('should set boolean conditions', () => {
    const { conditions } = buildConditions({
      hasAttachments: true,
      sentToMe: true,
      sentOnlyToMe: true,
      sentCcMe: true,
      isAutomaticReply: true,
    });
    expect(conditions.hasAttachment).toBe(true);
    expect(conditions.sentToMe).toBe(true);
    expect(conditions.sentOnlyToMe).toBe(true);
    expect(conditions.sentCcMe).toBe(true);
    expect(conditions.isAutomaticReply).toBe(true);
  });

  it('should not set boolean conditions when false', () => {
    const { conditions } = buildConditions({
      hasAttachments: false,
      sentToMe: false,
    });
    expect(conditions.hasAttachment).toBeUndefined();
    expect(conditions.sentToMe).toBeUndefined();
  });

  it('should validate importance enum', () => {
    const { conditions, warnings } = buildConditions({
      importance: 'high',
    });
    expect(conditions.importance).toBe('high');
    expect(warnings).toHaveLength(0);
  });

  it('should warn on invalid importance', () => {
    const { conditions, warnings } = buildConditions({
      importance: 'critical',
    });
    expect(conditions.importance).toBeUndefined();
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Invalid importance');
  });

  it('should validate sensitivity enum', () => {
    const { conditions } = buildConditions({ sensitivity: 'confidential' });
    expect(conditions.sensitivity).toBe('confidential');
  });

  it('should warn on invalid sensitivity', () => {
    const { warnings } = buildConditions({ sensitivity: 'top-secret' });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('Invalid sensitivity');
  });

  it('should combine multiple conditions', () => {
    const { conditions } = buildConditions({
      fromAddresses: 'boss@example.com',
      containsSubject: 'urgent, critical',
      hasAttachments: true,
      importance: 'high',
    });
    expect(conditions.fromAddresses).toHaveLength(1);
    expect(conditions.subjectContains).toEqual(['urgent', 'critical']);
    expect(conditions.hasAttachment).toBe(true);
    expect(conditions.importance).toBe('high');
  });

  it('should return empty conditions when no args match', () => {
    const { conditions } = buildConditions({});
    expect(Object.keys(conditions)).toHaveLength(0);
  });
});

describe('buildActions', () => {
  const mockToken = 'test_token';

  beforeEach(() => {
    jest.resetAllMocks();
    checkRecipientAllowlist.mockReturnValue(null);
  });

  it('should resolve moveToFolder by name', async () => {
    getFolderIdByName.mockResolvedValue('folder-id-123');

    const { actions, warnings } = await buildActions(
      { moveToFolder: 'Archive' },
      mockToken
    );

    expect(actions.moveToFolder).toBe('folder-id-123');
    expect(getFolderIdByName).toHaveBeenCalledWith(mockToken, 'Archive');
    expect(warnings.filter((w) => w.includes('not found'))).toHaveLength(0);
  });

  it('should warn when moveToFolder not found', async () => {
    getFolderIdByName.mockResolvedValue(null);

    const { warnings } = await buildActions(
      { moveToFolder: 'NonExistent' },
      mockToken
    );

    expect(warnings.some((w) => w.includes('not found'))).toBe(true);
  });

  it('should resolve copyToFolder by name', async () => {
    getFolderIdByName.mockResolvedValue('copy-folder-id');

    const { actions } = await buildActions(
      { copyToFolder: 'Projects' },
      mockToken
    );

    expect(actions.copyToFolder).toBe('copy-folder-id');
  });

  it('should set markAsRead', async () => {
    const { actions } = await buildActions({ markAsRead: true }, mockToken);
    expect(actions.markAsRead).toBe(true);
  });

  it('should set stopProcessingRules', async () => {
    const { actions } = await buildActions(
      { stopProcessingRules: true },
      mockToken
    );
    expect(actions.stopProcessingRules).toBe(true);
  });

  it('should set deleteMessage with warning', async () => {
    const { actions, warnings } = await buildActions(
      { deleteMessage: true },
      mockToken
    );
    expect(actions.delete).toBe(true);
    expect(warnings.some((w) => w.includes('Deleted Items'))).toBe(true);
  });

  it('should validate markImportance enum', async () => {
    const { actions } = await buildActions(
      { markImportance: 'high' },
      mockToken
    );
    expect(actions.markImportance).toBe('high');
  });

  it('should warn on invalid markImportance', async () => {
    const { actions, warnings } = await buildActions(
      { markImportance: 'critical' },
      mockToken
    );
    expect(actions.markImportance).toBeUndefined();
    expect(warnings.some((w) => w.includes('Invalid markImportance'))).toBe(
      true
    );
  });

  it('should build forwardTo with recipient allowlist check', async () => {
    const { actions, warnings } = await buildActions(
      { forwardTo: 'user@example.com' },
      mockToken
    );

    expect(actions.forwardTo).toEqual([
      { emailAddress: { address: 'user@example.com' } },
    ]);
    expect(warnings.some((w) => w.includes('forward'))).toBe(true);
    expect(checkRecipientAllowlist).toHaveBeenCalled();
  });

  it('should block forwardTo when allowlist rejects', async () => {
    checkRecipientAllowlist.mockReturnValue({
      content: [{ type: 'text', text: 'blocked' }],
    });

    const { actions, warnings } = await buildActions(
      { forwardTo: 'blocked@evil.com' },
      mockToken
    );

    expect(actions.forwardTo).toBeUndefined();
    expect(warnings.some((w) => w.includes('blocked by allowlist'))).toBe(true);
  });

  it('should build redirectTo', async () => {
    const { actions } = await buildActions(
      { redirectTo: 'alias@example.com' },
      mockToken
    );
    expect(actions.redirectTo).toEqual([
      { emailAddress: { address: 'alias@example.com' } },
    ]);
  });

  it('should build assignCategories', async () => {
    const { actions } = await buildActions(
      { assignCategories: 'Work, Important' },
      mockToken
    );
    expect(actions.assignCategories).toEqual(['Work', 'Important']);
  });
});

describe('buildExceptions', () => {
  it('should build exceptFromAddresses', () => {
    const { exceptions } = buildExceptions({
      exceptFromAddresses: 'noreply@example.com',
    });
    expect(exceptions.fromAddresses).toEqual([
      { emailAddress: { address: 'noreply@example.com' } },
    ]);
  });

  it('should build exceptSubjectContains', () => {
    const { exceptions } = buildExceptions({
      exceptSubjectContains: 'unsubscribe, opt-out',
    });
    expect(exceptions.subjectContains).toEqual(['unsubscribe', 'opt-out']);
  });

  it('should build exceptSenderContains', () => {
    const { exceptions } = buildExceptions({
      exceptSenderContains: 'noreply',
    });
    expect(exceptions.senderContains).toEqual(['noreply']);
  });

  it('should build exceptBodyContains', () => {
    const { exceptions } = buildExceptions({
      exceptBodyContains: 'automated message',
    });
    expect(exceptions.bodyContains).toEqual(['automated message']);
  });

  it('should build exceptHasAttachments', () => {
    const { exceptions } = buildExceptions({ exceptHasAttachments: true });
    expect(exceptions.hasAttachment).toBe(true);
  });

  it('should return empty exceptions when no except params', () => {
    const { exceptions } = buildExceptions({});
    expect(Object.keys(exceptions)).toHaveLength(0);
  });

  it('should combine multiple exceptions', () => {
    const { exceptions } = buildExceptions({
      exceptFromAddresses: 'boss@example.com',
      exceptSubjectContains: 'FYI',
      exceptHasAttachments: true,
    });
    expect(exceptions.fromAddresses).toHaveLength(1);
    expect(exceptions.subjectContains).toEqual(['FYI']);
    expect(exceptions.hasAttachment).toBe(true);
  });
});

describe('hasAnyCondition', () => {
  it('should return true for fromAddresses', () => {
    expect(hasAnyCondition({ fromAddresses: 'a@b.com' })).toBe(true);
  });

  it('should return true for containsSubject', () => {
    expect(hasAnyCondition({ containsSubject: 'test' })).toBe(true);
  });

  it('should return true for new conditions', () => {
    expect(hasAnyCondition({ bodyContains: 'test' })).toBe(true);
    expect(hasAnyCondition({ senderContains: 'test' })).toBe(true);
    expect(hasAnyCondition({ importance: 'high' })).toBe(true);
    expect(hasAnyCondition({ sentToMe: true })).toBe(true);
  });

  it('should return false for empty args', () => {
    expect(hasAnyCondition({})).toBe(false);
  });

  it('should return false for false booleans', () => {
    expect(hasAnyCondition({ hasAttachments: false, sentToMe: false })).toBe(
      false
    );
  });
});

describe('hasAnyAction', () => {
  it('should return true for moveToFolder', () => {
    expect(hasAnyAction({ moveToFolder: 'Archive' })).toBe(true);
  });

  it('should return true for new actions', () => {
    expect(hasAnyAction({ copyToFolder: 'Archive' })).toBe(true);
    expect(hasAnyAction({ forwardTo: 'a@b.com' })).toBe(true);
    expect(hasAnyAction({ assignCategories: 'Work' })).toBe(true);
    expect(hasAnyAction({ deleteMessage: true })).toBe(true);
    expect(hasAnyAction({ stopProcessingRules: true })).toBe(true);
  });

  it('should return false for empty args', () => {
    expect(hasAnyAction({})).toBe(false);
  });
});

describe('constants', () => {
  it('should export valid importance values', () => {
    expect(VALID_IMPORTANCE).toEqual(['low', 'normal', 'high']);
  });

  it('should export valid sensitivity values', () => {
    expect(VALID_SENSITIVITY).toEqual([
      'normal',
      'personal',
      'private',
      'confidential',
    ]);
  });
});
