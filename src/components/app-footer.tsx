export function AppFooter() {
  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground mt-auto">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} Chat Assistant. All rights reserved.</p>
      </div>
    </footer>
  )
}

