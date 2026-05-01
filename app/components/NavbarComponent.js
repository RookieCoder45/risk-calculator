
import Link from "next/link"
import styles from "./NavbarComponent.module.css"


export default function NavbarComponent() {
  return (
    <div className={styles.navbar}>
      <Link href="/">Home</Link>
      <Link href="/simulation">Simulation</Link>
    </div>
  )
}