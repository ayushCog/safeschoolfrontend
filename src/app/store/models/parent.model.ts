export type ParentStatus = 'active' | 'inactive' | 'archived';

export type ParentRelation = 'mother' | 'father' | 'guardian' | 'other';

export interface Parent {
  parentID: string;
  name: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  relation: ParentRelation;
  studentID: string;
  status: ParentStatus;
}
