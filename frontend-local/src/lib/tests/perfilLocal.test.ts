import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import ProfileCard from '$lib/components/perfil-local/profile-card.svelte'

describe('ProfileCard', () => {
  it('renderiza el título correctamente', () => {
    render(ProfileCard, { props: { title: 'Perfil del Local' } })
    const heading = screen.getByText('Perfil del Local')
    expect(heading).toBeInTheDocument()
  })
})
