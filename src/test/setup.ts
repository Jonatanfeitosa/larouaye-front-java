import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta a tela entre um teste e outro, para um teste não influenciar o seguinte.
afterEach(() => {
  cleanup()
})
