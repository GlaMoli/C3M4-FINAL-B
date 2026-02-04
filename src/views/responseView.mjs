export function renderizarPelicula(movie) {
  return {
    Título: movie.title,
    Género: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
    Director: movie.director,
    Cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast,
    AñoEstreno: movie.releaseYear,
    DuraciónMinutos: movie.duration,
    Rating: movie.rating,
    Clasificación: movie.classification,
    RestricciónEdad: movie.ageRestriction,
    Sinopsis: movie.synopsis,
    PosterURL: movie.posterURL,
    TrailerURL: movie.trailerURL,
    Idioma: movie.language,
    Subtítulos: Array.isArray(movie.subtitles) ? movie.subtitles.join(', ') : movie.subtitles,
    IdiomasDisponibles: Array.isArray(movie.availableLanguages) 
      ? movie.availableLanguages.join(', ') 
      : movie.availableLanguages,
    StreamURL: movie.streamUrl,
    DownloadURL: movie.downloadUrl,
  };
}

export function renderizarListaPeliculas(movies) {
  return movies.map(movie => renderizarPelicula(movie));
}