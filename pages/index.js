import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

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
  const [query, setQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [toggle, setToggle] = useState(false)

  const calculateAverageGrade = (grades) => {
    const gradesNumber = grades.map((grade) => Number(grade))
    const sum = gradesNumber.reduce((accum, grade) => accum + grade, 0)
    const average = sum/gradesNumber.length
    return average.toFixed(3)
  }

  const filterStudentsByName = useCallback(() => {
    let filteredStudents = students

    if(query){
      filteredStudents = filteredStudents.filter((student) =>
        student.firstName.toLowerCase().includes(query.toLowerCase())
      )
    }

    setFilteredStudents(filteredStudents)
  }, [students, query])

  useEffect(() => {
    filterStudentsByName()
  }, [query, filterStudentsByName])

  function handleToggle(){
    setToggle(!toggle)
  }

  return (
    <main>
      <input 
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name"
      />

      {filteredStudents.map((student) => (
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
          <button onClick={handleToggle}>See grades</button>
          {toggle && student.grades.map((grade) => (
            <p>{grade}</p>
          ))}
        </div>
      ))}
    </main>
  );
}