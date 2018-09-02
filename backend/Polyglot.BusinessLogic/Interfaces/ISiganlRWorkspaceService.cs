﻿using System.Threading.Tasks;

namespace Polyglot.BusinessLogic.Interfaces
{
    public interface ISignalRWorkspaceService
    {
        Task ChangedTranslation(string groupName, int translationId);
        
        Task СommentsChanged(string groupName, int commentId);
        
       Task ComplexStringAdded(string groupName, int complexStringId);

        Task ComplexStringRemoved(string groupName, int complexStringId);

        Task LanguageRemoved(string groupName, int languageId);

        Task LanguagesAdded(string groupName, int[] languagesIds);

        Task LanguageTranslationCommitted(string groupName, int languageId);
    }
}