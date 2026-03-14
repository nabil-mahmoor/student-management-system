type Student = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  degree: "CS" | "SE" | "CE" | "DBA" | "IT" | "IS";
  intake: "40" | "41" | "42" | "43";
  email: string;
};

type Course = {
  id: number;
  code: string;
  name: string;
  description: string;
  enrolled: number;
  tags: string[];
};