/**
 * Google Calendar APIの色ID
 */
export const DataLocation = {
    Storage: 'storage',
    Web: 'web',
} as const;

/**
 * Google Calendar APIの色IDの型
 */
export type DataLocationType = (typeof DataLocation)[keyof typeof DataLocation];
