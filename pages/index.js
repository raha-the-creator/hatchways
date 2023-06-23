import Image from "next/image";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const response = await fetch("https://api.hatchways.io/assessment/students")
  const data = await response.json()

  return {
    props: {
      students: data.students
    }
  }
}

export default function Home({ students }) {
  const calculateAverageGrade = (grades) => {
    const gradesNumber = grades.map((grade) => Number(grade))
    const sum = gradesNumber.reduce((accum, grade) => accum + grade, 0)
    const average = sum/gradesNumber.length
    return average.toFixed(3)
  }

  return (
    <main>
      {students.map((student) => (
        <div className="m-2 border w-3/12" key={student.id}>
          <Image
            src={student.pic}
            width={50}
            height={50}
          />
          <p>{student.firstName} {student.lastName}</p>
          <p>Email: {student.email}</p>
          <p>Company: {student.company}</p>
          <p>Skill: {student.skill}</p>
          <p>Average: {calculateAverageGrade(student.grades)}</p>
        </div>
      ))}
    </main>
  );
}