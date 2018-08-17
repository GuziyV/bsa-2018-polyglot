using System;
using System.Collections.Generic;

namespace Polyglot.Common.DTOs
{
    public class ProjectDTO
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Technology { get; set; }

        public string ImageUrl { get; set; }

        public DateTime CreatedOn { get; set; }

        public UserProfileDTO UserProfile { get; set; }

        public LanguageDTO MainLanguage { get; set; }
		
        public List<TeamDTO> Teams { get; set; }

        public List<TranslationDTO> Translations { get; set; }

        public List<LanguageDTO> ProjectLanguageses { get; set; }

        public List<GlossaryDTO> ProjectGlossaries { get; set; }

        public List<TagDTO> ProjectTags { get; set; }
		
        public ProjectDTO()
        {
			
            Teams = new List<TeamDTO>();
            Translations = new List<TranslationDTO>();
            ProjectLanguageses = new List<LanguageDTO>();
            ProjectGlossaries = new List<GlossaryDTO>();
            ProjectTags = new List<TagDTO>();
			
        }
    }
}
