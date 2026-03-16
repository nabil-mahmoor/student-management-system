type Student = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  degree: "BCS" | "BSE" | "BCE" | "DBA" | "BIT" | "BIS";
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
  imageUrl: string;
};
