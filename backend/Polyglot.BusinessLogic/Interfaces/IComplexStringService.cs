﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Polyglot.Common.DTOs.NoSQL;

namespace Polyglot.BusinessLogic.Interfaces
{
    public interface IComplexStringService
    {
        Task<IEnumerable<ComplexStringDTO>> GetListAsync();

        Task<ComplexStringDTO> GetComplexString(int identifier);
        
        Task<ComplexStringDTO> ModifyComplexString(ComplexStringDTO entity);

        Task<bool> DeleteComplexString(int identifier);

        Task<ComplexStringDTO> AddComplexString(ComplexStringDTO entity);

        Task<IEnumerable<TranslationDTO>> GetStringTranslationsAsync(int identifier);

        Task<TranslationDTO> SetStringTranslation(int identifier, TranslationDTO translation);

        Task<TranslationDTO> RevertTranslationHistory(int identifier, Guid translationId, Guid historyId);

        Task<IEnumerable<CommentDTO>> SetComment(int identifier, CommentDTO comment, int itemsOnPage);
        
        Task<IEnumerable<CommentDTO>> DeleteComment(int identifier, Guid commentId);

        Task<IEnumerable<CommentDTO>> EditComment(int identifier, CommentDTO comment);

        Task<IEnumerable<CommentDTO>> GetCommentsAsync(int identifier);

        Task<IEnumerable<CommentDTO>> GetCommentsWithPaginationAsync(int id, int itemsOnPage, int page);

        Task<TranslationDTO> EditStringTranslation(int identifier, TranslationDTO translation);

        Task<TranslationDTO> ConfirmTranslation(int identifier, TranslationDTO translation);

        Task<TranslationDTO> UnConfirmTranslation(int identifier, TranslationDTO translation);

        Task<IEnumerable<HistoryDTO>> GetHistoryAsync(int identifier, Guid translationId, int itemsOnPage, int page);

		    Task<AdditionalTranslationDTO> AddOptionalTranslation(int stringId, Guid translationId, string value);

		    Task<IEnumerable<OptionalTranslationDTO>> GetOptionalTranslations(int stringId, Guid translationId);

        Task<string> ReIndex();
      
        Task ChangeStringStatus(int id, bool status, string groupName);
    }
}
