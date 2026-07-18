package SprintManager.backend.service;

import SprintManager.backend.model.Member;
import SprintManager.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {
    private final MemberRepository memberRepository;
    public MemberService (MemberRepository memberRepository){this.memberRepository = memberRepository;}

    public Member getById(Long id){
        return  memberRepository.findById(id).orElse(null);
    }

    public List<Member> getAll(){
        return memberRepository.findAll();
    }

    public Member create(Member member){
        return memberRepository.save(member);
    }

    public boolean delete(Long id){
        if(memberRepository.existsById(id)){
            memberRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
