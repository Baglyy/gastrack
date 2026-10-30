/**
 * Niveau de zoom minimal pour afficher et charger les stations.
 * En dessous, la carte est trop large pour que la recherche soit pertinente :
 * aucune requête n'est envoyée. (11 ≈ une agglomération ; 12 = ville + alentours)
 */
export const MIN_ZOOM_FOR_STATIONS = 11;

/** Niveau de zoom au chargement de la page et après une géolocalisation. */
export const INITIAL_ZOOM = 12;
export const LOCATE_ZOOM = 13;
