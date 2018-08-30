﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Polyglot.BusinessLogic.Services;
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

        Task<IEnumerable<CommentDTO>> SetComments(int identifier, IEnumerable<CommentDTO> comments);

        Task<IEnumerable<CommentDTO>> GetCommentsAsync(int identifier);

        Task<TranslationDTO> EditStringTranslation(int identifier, TranslationDTO translation);

        Task<IEnumerable<HistoryDTO>> GetHistoryAsync(int identifier, Guid translationId);

		Task<AdditionalTranslationDTO> AddOptionalTranslation(int stringId, Guid translationId, string value);
    }
}
