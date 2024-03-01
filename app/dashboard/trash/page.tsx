import React from 'react'
import { FileBrowser } from '../_components/file-browser'

export default function FavoritesPage() {
  return <FileBrowser title="Files marked for deletion" deletedOnly />;
}
