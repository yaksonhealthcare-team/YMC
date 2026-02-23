export type MemberHistoryTab = 'reservation' | 'membership';

export interface MemberHistoryState {
  activeTab?: MemberHistoryTab;
}
