package com.bezkoder.springjwt.security.services;



import com.bezkoder.springjwt.models.ImageHome;
import com.bezkoder.springjwt.models.ImageModel;
import com.bezkoder.springjwt.repository.ImageHomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImageHomeService {

    @Autowired
    private ImageHomeRepository imageRepository;


    /**
     * Enregistre une image dans la base de données.
     *
     * @param imageModel L'image à enregistrer.
     * @return L'image enregistrée.
     */
    public ImageHome saveImage(ImageHome imageModel) {
        return imageRepository.save(imageModel);
    }

    /**
     * Récupère toutes les images enregistrées dans la base de données.
     *
     * @return Liste des images.
     */
    public List<ImageHome> getAllImages() {
        return imageRepository.findAll();
    }



    /**
     * Récupère une image par son ID.
     *
     * @param id L'ID de l'image à récupérer.
     * @return Un `Optional` contenant l'image si elle est trouvée, sinon `Optional.empty()`.
     */
    public Optional<ImageHome> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    /**
     * Supprime une image par son ID.
     *
     * @param id L'ID de l'image à supprimer.
     */
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }
}
